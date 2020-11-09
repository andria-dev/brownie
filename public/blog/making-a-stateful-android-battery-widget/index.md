---
title: Making a Stateful Android Battery Widget
description: My notes and thoughts on developing a beautiful battery widget for Android
date: 2020-11-07
published: true
---

In this article, I will be detailing my experience in adding a new stateful widget to my Android application: The battery widget. Battery indicators are very common and extremely useful. My phone would die all the time if I didn't have a reliable indicator for my battery.

This battery widget should be able to:

- Update battery percentage and battery indicator whenever the value changes.
- Display if the phone is charging or not.
- Launch the battery settings when touched.

<picture>
	<source srcset="/blog/making-a-stateful-android-battery-widget/battery-widget.avif" type="image/avif">
    <source srcset="/blog/making-a-stateful-android-battery-widget/battery-widget.webp" type="image/webp">
	<img src="/blog/making-a-stateful-android-battery-widget/battery-widget.png" alt="Android battery widget displaying the percentage and charging status of the battery.">
</picture>
<br>

First, let's go over how to launch the battery settings from our widget. This will be different from the last article where we launched an app. In this case, the battery settings are not an app but instead a shortcut within the Settings app.

## Launching a shortcut

First, we'll need to figure out what the name of the shortcut is for the battery settings. To do this, I had to do a lot of log checking while opening the battery settings. I eventually determined that the full component name for it is:

```kotlin
"com.android.settings.Settings$PowerUsageSummaryActivity"
```

It is important to figure out the full path for this shortcut to be able to open it. Having found the shortcut, we should now be able to launch the shortcut as simply as an activity.

```kotlin
// Launch battery settings on touch
val intentToLaunchBatterySettings = Intent(Intent.ACTION_MAIN).apply {
	component = ComponentName(
		"com.android.settings",
		"com.android.settings.Settings\$PowerUsageSummaryActivity"
    )
}
val pendingIntent = PendingIntent.getActivity(
    context, appWidgetId, intentToLaunchBatterySettings, 0
)
views.setOnClickPendingIntent(R.id.Root, pendingIntent)
```

---

## Updating a Widget with Data from System Broadcast Events

When making a widget, you'll need a source of data. You can either build that source of data as a service within your application or, in my instance, you can get the information for your widget from the system.

In my case, I needed to listen for `Intent.ACTION_BATTERY_CHANGED` events. To listen for these events we need to create a class extending `BroadcastReceiver` and implementing it's `onReceive()` method. A simple implementation of that could look like:

```kotlin
class BatteryReceiver : BroadcastReceiver() {
	override fun onReceive(context: Context, intent: Intent) {
        TODO("Not implemented yet.")
	}
}
```

From inside the `onReceive()` method, we have received our `intent`. Now we just need to deliver that information to our widget. To do so, we must retrieve the instance of the `AppWidgetManager` and get the IDs of all the instances of the widget you're building (e.g. `BatteryWidget`).

```kotlin
// To retrieve the AppWidgetManager instance
val appWidgetManager = AppWidgetManager.getInstance(context)

// To retrieve the widget IDs
val appWidgetIds = ComponentName(context, YourWidgetClass::class.java)
	.let { provider ->
		appWidgetManager.getAppWidgetIds(provider)
	}
```

With access to the widget manager and the IDs of your widget instances, for each widget ID, you can now call the static method `updateAppWidget` that was created when you did `File > New > Widget > App Widget`. That being said, you'll need to add an extra parameter to it for your `intent`.

Note, I've moved the method from `internal` into a `companion object {}` as the `internal` keyword does not make that function specific to your class and, therefore, prevents you from making multiple widgets that way.

```kotlin
class BatteryWiget : AppWidgetProvider() {
	/* ... */
	// a companion object with no name is the equivalent of `static` keyword
	companion object {
		fun updateAppWidget(
			context: Context,
			appWidgetManager: AppWidgetManager,
			appWidgetId: Int,
			intent: Intent
		) {
			/* Code to update your widget with battery info here */
		}
	}
}
```

I would also suggest implementing a data model class that abstracts out the logic to get the relevant information from your intent.

At this point, the change in `updateAppWidget`'s signature may have broken your build. As your widget needs an intent to update the screen, you'll need to retrieve the intent before `onUpdate()` is ready to call update your widgets. We can do this by registering a `null` broadcast receiver which will give us the intent immediately as opposed to listening until stopped.

```kotlin
override fun onUpdate(
	context: Context,
	appWidgetManager: AppWidgetManager,
	appWidgetIds: IntArray
) {
	// get battery info
	val intent = context.registerReceiver(
		null, IntentFilter(Intent.ACTION_BATTERY_CHANGED)
	)

	// update all widgets with new intent
	for (widgetId in appWidgetIds) {
		updateAppWidget(context, appWidgetManager, widgetId, intent)
	}
}
```

You'll probably have noticed two important aspects to this.

1. The `IntentFilter` is used to specify what intents we should retrieve or listen for.
2. If we have to register a broadcast receiver to get intents, do we have to register our `BatteryReceiver`?

Yes, we must register our `BatteryReceiver` before it can actually function as a `BroadcastReceiver`. You might be tempted to do so from the `onEnabled()` method, however, an `AppWidgetProvider` is unable to register a non-null `BroadcastReceiver`. To register our receiver, we must create a service. Due to the nature of Android tying services to the main activity, we will need to make the service _sticky_, meaning **it will try to restart itself if it's closed by the system**, and we'll need to **start it as a foreground service**.

### Creating a Sticky Foreground Service

Before we get started, let's go over all the parts that make up a sticky foreground service:

#### Services:

- Your class extends `Service`
- Implements `onBind()` from which we'll return null

#### Foreground services:

- Is started with `startForegroundService()`
- Immediately calls `startForeground()` after having started
- Gives `startForeground()` a valid `Notification` to display

#### Sticky:

- Returns `START_STICKY` from `onStartCommand()`

We will be doing all of our `BroadcastReceiver` related work inside `onStartCommand()` and `onDestroy()`. Specifically, the work we'll be doing is creating and registering our `BatteryReceiver` with an `IntentFilter` that will catch the system's battery related broadcasts.

Here's a breakdown of each method and property we will need to define:

```kotlin
class BroadcastMonitorService : Service() {
	private val TAG = BroadcastMonitorService::class.simpleName

	// Receivers
	private val batteryReceiver = BatteryReceiver()

	// Notification constants
	private val NOTIFICATION_CHANNEL_ID = TAG.toString()
	private val NOTIFICATION_CHANNEL_NAME = "Widget service"
	private val NOTIFICATION_DESCRIPTION = "Allows widgets to be updated consistently"
	private val NOTIFICATION_MESSAGE = "Tap this to open the app"
	private val NOTIFICATION_COLOR = Color.DKGRAY

	// Notification values
	private lateinit var notificationManager: NotificationManager
	private lateinit var notificationChannel: NotificationChannel
	private lateinit var notification: Notification

	private fun init() {
	}

	override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
	}

	override fun onDestroy() {
	}

	override fun onBind(intent: Intent): IBinder? { return null }
}
```

First let's start with our `init()` definition. In this method we will be building our notification that is required to create a foreground service. You might be wondering why I'm not using Kotlin's `init { }` syntax. We don't want this to run as soon as the class is instantiated but instead once our instance connects to its context.

You can call this function whatever you'd like, I was simply originally using the `init { }` syntax and found it easier to keep the name.

```kotlin
private fun init() {
    // The Notification Manager allows us to
	notificationManager = getSystemService(
        Context.NOTIFICATION_SERVICE
    ) as NotificationManager
	notificationChannel = NotificationChannel(
		NOTIFICATION_CHANNEL_ID,
		NOTIFICATION_CHANNEL_NAME,
		NotificationManager.IMPORTANCE_NONE
	).apply {
		description = NOTIFICATION_DESCRIPTION
		lightColor = NOTIFICATION_COLOR
		lockscreenVisibility = NotificationCompat.VISIBILITY_PRIVATE
	}
	notification = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
		.setOngoing(true)
		.setSmallIcon(R.mipmap.ic_launcher)
		.setPriority(NotificationCompat.PRIORITY_MIN)
		.setCategory(NotificationCompat.CATEGORY_SERVICE)
		.setContentText(NOTIFICATION_MESSAGE)
		.setContentIntent(
			PendingIntent.getActivity(
				this, 0,
				Intent(this, MainActivity::class.java), 0
			)
		)
		.build()
}
```

After writing the code to build our notification, we'll switch to `onStartCommand()`

```kotlin
override fun onStartCommand(
	intent: Intent, flags: Int, startId: Int
): Int {
	/* Immediately call `startForeground` or this service won't
     * successfully start. `startId` is our unique identifier and
	 * `notification` was created in `init()`.
	 */
    init()
    notificationManager.createNotificationChannel(notificationChannel)
	startForeground(startId, notification)


	/* Then we'll register our receiver for multiple intents
	 * Repeat this with different receivers to handle different widgets */
	registerReceiver(batteryReceiver, IntentFilter().apply {
		addAction(Intent.ACTION_BATTERY_CHANGED)
		addAction(Intent.ACTION_BATTERY_LOW)
		addAction(Intent.ACTION_BATTERY_OKAY)
	})

	// Make it sticky
	return START_STICKY
}
```

Then, to make sure we aren't still receiving intents and, therefore, trying to update our now non-existent widgets, we will unregister our receiver.

```kotlin
override fun onDestroy() {
	unregisterReceiver(batteryReceiver)
}
```

You'll likely have noticed by now that we haven't set up this service to be started by anything. This is done from within an activity, preferably your `MainActivity`. I'm not going to go in to how to allow the user to stop the service with a button as it's not too complex.

Here is an example of how to start the foreground service we created:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Start foreground sticky service to update widgets
    const serviceIntent = Intent(this, BroadcastMonitorService::class.java)
    this.startForegroundService(serviceIntent)

    // To stop: this.stopService(serviceIntent)
    /* Do MainActivity stuff here... */
}
```

Even with all of this, we will still need to add an entry to our `AndroidManifest.xml` file that declares our class as a service. For example, we could add the following under our `<application>`:

```xml
<service
    android:name=".BroadcastMonitorService"
    android:process=":broadcastMonitorProcess" />
```

In this code `android:name` is the name of your service class.

---

## Displaying the battery level

Personally, I struggled with finding a way to display my battery level in a way that could provide multiple colors based on the battery level and charging state. Let's start with the basis of the battery level first.

The basis of the battery level indicator is [the `<ProgressBar>` element](https://developer.android.com/reference/android/widget/ProgressBar). Normally the progress bar is horizontal, however, you can inspect the source of the `android:progressDrawable` style that it uses. From this, you can then create your own style to display the progress bar in a manner that suits your widget. In my case, I simply wanted a verticle progress bar that fills from bottom to top. Here is what I came up with:

```xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
	<item android:id="@android:id/background" android:gravity="bottom">
		<shape>
			<corners android:radius="@dimen/battery_meter_corner_radius" />
			<solid android:color="@color/defaultBatteryBackground" />
		</shape>
	</item>

	<item android:id="@android:id/progress">
		<clip android:clipOrientation="vertical" android:gravity="bottom">
			<shape>
				<corners android:radius="@dimen/battery_meter_corner_radius" />
				<solid android:color="@color/defaultBattery" />
			</shape>
		</clip>
	</item>
</layer-list>

<!-- Then, inside `styles.xml` you can add something like this: -->
<style name="Widget.AppCompat.ProgressBar.Vertical" parent="Widget.AppCompat.ProgressBar">
    <item name="android:indeterminateOnly">false</item>
    <item name="android:progressDrawable">@drawable/progress_vertical</item>
    <item name="android:mirrorForRtl">false</item>
</style>
```

Once I had a vertical `<ProgessBar>`, I was able to connect it to my widget to display the most current battery information. To do so, I wrote a helper class which converts the battery intent into usable data. There are two values we need: Battery percentage, and whether the battery is charging.

```kotlin
batteryLevel = let {
    val level = getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
    val scale = getIntExtra(BatteryManager.EXTRA_SCALE, -1)
    level * 100 / scale
}

chargingStatus = getIntExtra(
    BatteryManager.EXTRA_STATUS, BatteryManager.BATTERY_STATUS_UNKNOWN
).let { status ->
    when (status) {
        BatteryManager.BATTERY_STATUS_CHARGING,
        BatteryManager.BATTERY_STATUS_FULL -> CHARGING
        BatteryManager.BATTERY_STATUS_DISCHARGING,
        BatteryManager.BATTERY_STATUS_NOT_CHARGING -> DISCHARGING
        else -> UNKNOWN
    }
}

// CHARGING, DISCHARGING, and UNKNOWN are all constants I created.
// We can also take this `chargingStatus` and display a message based on it (e.g. "Charging" or "Not charging").
```

Finally, once you've created these values, you can attach them to your layout:

```kotlin
// [=== ]
views.setInt(R.id.BatteryMeter, "setProgress", battery.level)
// 98%
views.setTextViewText(R.id.BatteryPercentage, "${battery.level}")
// "Charging" or "Not charging"
views.setTextViewText(R.id.ChargingText, battery.chargingIndicator)
```

### Let's rewind to the idea of different colors for different states

I said I struggled with this one for a while, however, I did find a solution. You can create multiple `<ProgressBar>`s and hide all but one. You'll still need to update the hidden ones' via `setProgress()` to avoid visual jumps when switching between `<ProgressBar>`s. This would look something like the following:

```xml
<ProgressBar
    android:id="@+id/BatteryMeter.default"
    style="@style/Widget.AppCompat.ProgressBar.Vertical"
    android:layout_width="@dimen/battery_meter_width"
    android:layout_height="@dimen/battery_meter_height"
    android:layout_row="1"
    android:layout_column="0"
    android:layout_gravity="bottom"
    android:layout_marginStart="8dp"
    android:progress="100"
    android:progressBackgroundTint="@color/defaultBatteryBackground"
    android:progressTint="@color/defaultBattery"
    android:visibility="gone" />

<!-- Repeated values are removed for shortness of this article. -->
<ProgressBar
    android:id="@+id/BatteryMeter.charging"
    android:progressBackgroundTint="@color/chargingBatteryBackground"
    android:progressTint="@color/chargingBattery"
    android:visibility="gone" />

<ProgressBar
    android:id="@+id/BatteryMeter.critical"
    android:progressBackgroundTint="@color/criticalBatteryBackground"
    android:progressTint="@color/criticalBattery"
    android:visibility="gone" />

<ProgressBar
    android:id="@+id/BatteryMeter.unknown"
    android:progressBackgroundTint="@color/unknownBatteryBackground"
    android:progressTint="@color/unknownBattery"
    android:visibility="visible" />
```

These `<ProgessBar>`s allow us to change the visibility of one to `View.VISIBLE` creating the effect of changing colors. This might seem a little odd, especially since you can see that there is a `android:progressTint` attribute to set the color and, generally, if you can set the attribute in the XML you can set it programmatically as well. In fact, you can set `android:progressTint` programmatically.

#### "Why in the world would I not change the progress tint programmatically?"

Put simply, Android widget development sucks. I'm sure the maintainers of Android have their reasons for locking widgets out of so much of the Android API ecosystem but I don't agree with not making the development process easier afterward.

The reason why you can't change the `progressTint` programmatically is that there is no method of `ProgressBar` that can take in a string or an integer as its only argument to change the tint. What I found was that the methods they implemented only took a `ColorStateList` which is a class.

In conclusion, widget development on Android is not easy, and I wish Google would stop building gorgeous iOS widgets for Apple and focus on giving their developer's a better DX.

<small>This is not a serious criticism of Google, however, widget development really is a struggle.</small>

## Thank you for reading this.

If you have any compliments or criticisms about this article, or the Android code in this article, reach out to me on Twitter.

---
title: Making a Stateful Android Battery Widget
description: My notes and thoughts on developing a battery widget for Android
date: 2020-11-07
published: false
---

In this article, I will be detailing my experience in adding a new stateful widget to my Android application: The battery widget. Battery indicators are very common and extremely useful. My phone would die all the time if I didn't have a reliable indicator for my battery.

This battery widget should be able to:

- Update battery percentage and battery indicator whenever the value changes.
- Display if the phone is charging or not.
- Launch the battery settings when touched.

First, let's go over how to launch the battery settings from our widget. This will be different from the last article where we launched an app. In this case, the battery settings are not an app but instead a shortcut within the Settings app.


## Launching a shortcut

First, we'll need to figure out what the name of the shortcut is for the battery settings. To do this, I had to do a lot of log checking while opening the battery settings. I eventually determined that the full component name for it is:

```
"com.android.settings.Settings$PowerUsageSummaryActivity"
```

It is important to figure out the full path for this shortcut to be able to open it. Having found the shortcut, we should now be able to launch the shortcut as simply as an app.

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

At this point, your build may be broken due to the change in `updateAppWidget`'s signature. As your widget needs an intent to update the screen, you'll need to retrieve the intent before `onUpdate()` is ready to call update your widgets. We can do this by registering a `null` broadcast receiver which will give us the intent immediately as opposed to listening until stopped.

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

Services:

- Your class extends `Service`
- Implements `onBind()` from which we'll return null

Foreground services:

- Is started with `startForegroundService()`
- Immediately calls `startForeground()` after having started
- Gives `startForeground()` a valid `Notification` to display

Sticky:

- returns `START_STICKY` from `onStartCommand()`

We will be doing all of our `BroadcastReceiver` related work inside `onStartCommand()` and `onDestroy()`. Specifically, the work we'll be doing is creating and registering our `BatteryReceiver` with an `IntentFilter` that will catch the system's battery related broadcasts.

Here's a breakdown of each method we'll need:

```kotlin
class BroadcastMonitorService : Service() {
	// Our broadcast receiver class
	private val batteryReceiver = BatteryReceiver()

	// Notifications
	private fun createNotificationChannel() {}
	private fun buildNotification() {}

	// Lifecycle methods
	override fun onStartCommand(
		intent: Intent, flags: Int, startId: Int
	): Int {}
	override fun onDestroy() {}

	// No binding allowed
	override fun onBind(intent: Intent): IBinder? { return null }
}
```

First let's start with `onStartCommand()`:

```kotlin
override fun onStartCommand(
	intent: Intent, flags: Int, startId: Int
): Int {
	/* Immediately call this or this service won't successfully start
	 * startId is our unique identifier and
	 * buildNotification() creates a valid notification for our service
	 */
	startForeground(startId, buildNotification())

	/* Then we'll register our receiver for multiple intents
	 * Repeat this with different receivers to handle more widgets */
	registerReceiver(batteryReceiver, IntentFilter().apply {
		addAction(Intent.ACTION_BATTERY_CHANGED)
		addAction(Intent.ACTION_BATTERY_LOW)
		addAction(Intent.ACTION_BATTERY_OKAY)
	})

	// make it sticky
	return START_STICKY
}
```

Then, to make sure we aren't still receiving intents and, therefore, trying to update our now non-existent widgets, we will unregister our receiver.

```kotlin
override fun onDestroy() {
	unregisterReceiver(batteryReceiver)
}
```

You will have noticed that we called `buildNotification()`, this method will simply create a `Notification` instance that specifies the icon, priority, category, its channel, and that the notification is not to be dismissed.

```kotlin
private fun buildNotification(): Notification {
	val channelId = createNotificationChannel(
		id = BroadcastMonitorService::class.simpleName.toString(),
		name = "Widgets"
	)

	return NotificationCompat.Builder(this, channelId)
		.setOngoing(true)
		.setSmallIcon(R.mipmap.ic_launcher)
		.setPriority(NotificationCompat.PRIORITY_MIN)
		.setCategory(NotificationCompat.CATEGORY_SERVICE)
		.build()
}
```

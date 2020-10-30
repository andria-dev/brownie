---
title: Making My First Android Widget — The Clock
description: My journey and notes on developing an Android widget
date: 2020-10-30
published: true
---

To create a clock, you should avoid attempting to implement your own clock via manually updating the screen at a recurring interval. Instead, you should use the `<TextClock>` element.

Before we go any further, this is what we will be building:


<picture>
	<source srcset="clock-widget-preview.avif" type="image/avif">
	<source srcset="clock-widget-preview.webp" type="image/webp">
	<img src="clock-widget-preview.png" alt="Digital clock widget showing the time and date.">
</picture>
<br>

The below code will display a `<TextClock>` with the format _"Mon, 28 Sep 09:04"_ that will update every second.

```xml
<TextClock android:id="@+id/MyClock"
	android:layout_width="wrap_content"
	android:layout_height="wrap_content"
	android:format24Hour="EEE, dd LLL HH:mm">
```

One should note that, if the user is in a non-specified format, in my case this would be `android:format12Hour`, and the user of your widget is using that format, your widget will not look at all as you expect it to.

Now that we have the basis of how to display each section of time (day, time, and date), we can work on the design elements.

---

## Rounded edges

In order to give an element rounded edges, you must define a `<shape>` with rounded edges in the `/res/drawable/` folder. From there, you can use that shape as the background for your element.

Let's start with defining the shape. We'll need a background color or something similar and rounded corners:

```xml
<!-- /res/drawable/widget_shape.xml -->
<?xml version="1.0" encoding="utf-8"?>
<shape xlmns:android="http://schemas.android.com/apk/res/android">
	<!-- Background color (can also be <gradient>) -->
	<solid android:color="#fff" />

	<!-- Radius for the corners -->
	<corners android:radius="32dp" />
</shape>
```

Now we can try to use it as the background for an element. This will produce a `<RelativeLayout>` with a background of `#fff` and a corner radius of `32dp`.

```xml
<RelativeLayout android:id="@+id/Root"
	android:layout_width="match_parent"
	android:layout_height="match_parent"
	android:background="@drawable/widget_shape">
```

Note that it would be beneficial to extract the `android:radius` value to a _dimen_ resource (i.e. `@dimen/widget_corner_radius`)

We can repeat this process with each rounded element like our hour indicator or other widgets.

The only thing we have left to do functionality-wise is opening up the Clock app when the user touches the widget.

---

## Action On Touch (Click)

With widgets, you can't use the `android:onClick` property in your layout XML. As an alternative, the `RemoteViews` API provides a method for this on your widget:

```kotlin
RemoteViews#setOnClickPendingIntent(
	viewId: int,
	pendingIntent: PendingIntent
)
```

You'll need two values to use this method, the `viewId` and the `pendingIntent`. To get the `viewId`, which we defined with the `android:id` attribute earlier, you can do `R.id.<id>` (i.e. `R.id.Root`). Then, to get the `pendingIntent`, you'll need to decide what you want to happen when the user clicks your widget. For this example, we'll show you how to open the "Clock" app.

### **Launching an app**

There are four steps to launching an app from a widget:

1. Give your widget an id with `android:id` like done above
2. Get your widget view with `R.id.<id>`
3. Create an `Intent` with an action of `Intent.ACTION_MAIN` and run `setPackage(packageName: String)`
4. Convert that `Intent` into a `PendingIntent`

To convert the `Intent` you created into a `PendingIntent`, you need to call `PendingIntent.getActivity`. Before we do that, let's go over why we're using `getActivity`.

There are four other methods on `PendingIntent` that function similarly: `getActivities`, `getBroadcast`, `getForegroundService`, and `getService`. We are using `getActivity` because we want to launch one app (also known as an "Activity").

To use `getActivity` we'll need three things: the `context`, a `requestCode` (unique identifier, for this we'll use our `appWidgetId`), and the original `Intent` we created to launch the Clock app.

```kotlin
PendingIntent.getActivity(context, appWidgetId, intentToLaunchClock)
```

After completing those steps you can successfully pass your values to `setOnClickPendingIntent` to attach the action of launching an app to your widget or other element.

```kotlin
// Open clock when widget is touched
val intentToLaunchClock = Intent(Intent.ACTION_MAIN).apply {
	setPackage("com.google.android.deskclock")
}
val pendingIntent = PendingIntent.getActivity(
	context, appWidgetId, intentToLaunchClock, 0
)
remoteViews.setOnClickPendingIntent(R.id.Root, pendingIntent)
```

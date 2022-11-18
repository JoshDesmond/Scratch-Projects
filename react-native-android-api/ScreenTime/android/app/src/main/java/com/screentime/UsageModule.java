package com.screentime;

import android.app.usage.UsageEvents;
import android.content.Context;
import android.icu.util.Calendar;
import android.util.Log;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.time.Duration;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;

public class UsageModule extends ReactContextBaseJavaModule {

    private static final String TAG = "UsageModule";

    UsageModule(ReactApplicationContext context) {
        super(context);
    }

    /**
     * TODO check for usage permission and if not found use
     * public static final String ACTION_USAGE_ACCESS_SETTINGS to launch into settings request
     */

    @Override
    public String getName() {
        return "UsageModule";
    }

    /**
     * A data class that stores processed usage info for a given app
     */
    private class AppUsageInfo {
        String appName, packageName;
        long timeInForeground;
        int eventCount;

        AppUsageInfo(String pName) {
            this.packageName=pName;
        }

        @Override
        public String toString() {
            return "AppUsageInfo{" +
                    "packageName='" + packageName + '\'' +
                    ", timeInForeground=" + timeInForeground +
                    ", eventCount=" + eventCount + '}';
        }
    }

    /**
     * Checks if the given event type constant is one of the event types being tracked/considered
     * @param eType a UsageEvents.Event constant
     * @return True if the event is relevant
     */
    private boolean isRelevantEventType(int eType) {
        if (eType == UsageEvents.Event.ACTIVITY_PAUSED) return true;
        if (eType == UsageEvents.Event.ACTIVITY_RESUMED) return true;
        if (eType == UsageEvents.Event.ACTIVITY_STOPPED) return true;
        if (eType == UsageEvents.Event.DEVICE_SHUTDOWN) return true;

        if (eType == UsageEvents.Event.NONE) return false; // ?
        return false;
    }

    private boolean isScreenInteractiveEventType(int eType) {
        if (eType == UsageEvents.Event.SCREEN_INTERACTIVE) return true;
        if (eType == UsageEvents.Event.SCREEN_NON_INTERACTIVE) return true;
        return false;
    }

    /**
     * Converts a UsageEvents.Event constant back into its string. Just for debugging purposes.
     * @param eType A UsageEvents.Event constant
     * @return The string of what the event constant represents
     */
    private String stringOfEventType(int eType) {
        if (eType == UsageEvents.Event.ACTIVITY_PAUSED) return "ACTIVITY_PAUSED";
        if (eType == UsageEvents.Event.ACTIVITY_RESUMED) return "ACTIVITY_RESUMED";
        if (eType == UsageEvents.Event.ACTIVITY_STOPPED) return "ACTIVITY_STOPPED";
        if (eType == UsageEvents.Event.DEVICE_SHUTDOWN) return "DEVICE_SHUTDOWN";
        if (eType == UsageEvents.Event.SCREEN_INTERACTIVE) return "SCREEN_INTERACTIVE";
        if (eType == UsageEvents.Event.SCREEN_NON_INTERACTIVE) return "SCREEN_NON_INTERACTIVE";
        if (eType == UsageEvents.Event.NONE) return "NONE?";
        if (eType == UsageEvents.Event.USER_INTERACTION) return "USER_INTERACTION";
        throw new IllegalArgumentException("Unknown Event type passed to stringOfEventType, " +
                "please update this method or filter out events before calling: " + eType);
    }

    /**
     * Method originally referencing and modified from: https://stackoverflow.com/a/45380396/4225094
     * CC BY-SA 3.0
     */
    void getUsageStatistics() {
        // Define a date range of the last 1 hours
        Calendar calendar = Calendar.getInstance();
        long endTime = calendar.getTimeInMillis();
        calendar.add(Calendar.HOUR, -1);
        long startTime = calendar.getTimeInMillis();

        // Get the UsageStatsManager Object to do queries with
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        assert usageStatsManager != null;

        // Query for all events in the given time range
        UsageEvents usageEvents = usageStatsManager.queryEvents(startTime, endTime);

        // Set up variables for processing all usage events
        UsageEvents.Event currEvent;
        List<UsageEvents.Event> eventList = new LinkedList<UsageEvents.Event>();
        Map<String, AppUsageInfo> usageMap = new HashMap<String, AppUsageInfo>();

        // Process all usage events
        while (usageEvents.hasNextEvent()) {
            // Get the event
            currEvent = new UsageEvents.Event();
            usageEvents.getNextEvent(currEvent);

            // Get the event type
            int eventType = currEvent.getEventType();

            // Filter for only the relevant start/pause/stop events
            if (isRelevantEventType(eventType)) {
                // Store an ordered list of them
                eventList.add(currEvent);

                Log.d(TAG, "Event Type: " + stringOfEventType(eventType) );

                // Also populate the map of all events indexed by packageName
                String key = currEvent.getPackageName();
                if (usageMap.get(key) == null) {
                    usageMap.put(key, new AppUsageInfo(key));
                }
            }
        }

        // Record the timestamp of the first event, in order to later calculate differences
        Instant startingTimeStamp = Instant.ofEpochMilli(eventList.get(0).getTimeStamp());

        // TODO Keep track of start events not yet matched with pause events

        // Process the list and count total usage time of apps
        for (UsageEvents.Event e : eventList) {
            // Log some info about the event for debugging
            Log.d(TAG, "=== Next Event: ===");
            Log.d(TAG, e.getPackageName());
            Log.d(TAG, stringOfEventType(e.getEventType()));

            // Calculate the amount of time since the starting event to print a timestamp for debugging
            Instant timeStamp = Instant.ofEpochMilli(e.getTimeStamp());
            Duration diff = Duration.between(startingTimeStamp, timeStamp);
            Log.d(TAG, String.valueOf(diff.getSeconds()));

            // Update the event account in the usageMap
            AppUsageInfo usage = usageMap.get(e.getPackageName());
            usage.eventCount++;

            // TODO pair start/pause events and count seconds elapsed
            // TODO Update the AppUsageInfo to update time spent
        }

        // Log the map of all usage statistics
        Log.d(TAG, usageMap.toString());
    }


    @ReactMethod
    public void testGranularCall(String echoString) {

        // Define a date range of the last 12 hours
        Calendar calendar = Calendar.getInstance();
        long endTime = calendar.getTimeInMillis();
        calendar.add(Calendar.HOUR, -6);
        long startTime = calendar.getTimeInMillis();

        Log.d("UsageModule", "echoString:" + echoString);
    }

    @ReactMethod
    public void testCall(String echoString) {
        getUsageStatistics(); // TEMP call other usage event query method

        // TODO archive all this

        // Get the UsageStatsManager Object to do queries with
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);

        // Define a date range of the last 12 hours
        Calendar calendar = Calendar.getInstance();
        long endTime = calendar.getTimeInMillis();
        calendar.add(Calendar.HOUR, -6);
        long startTime = calendar.getTimeInMillis();

        // query the usage stats
        List<UsageStats> list = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);

        // Sort the activities by use time
        list.sort((UsageStats a, UsageStats b) -> Math.toIntExact(a.getTotalTimeInForeground() - b.getTotalTimeInForeground()));

        // Print the usage stats for every activity
        for (UsageStats s : list) {
            // Format the time into readable format
            long time = s.getTotalTimeInForeground();
            String timeString = humanReadableFormat(Duration.ofMillis(time));

            // Print the time
            Log.d("UsageModule", "Event: " + s.getPackageName() + "\t" +  timeString);
        }

        // TEMP print the test string input
        Log.d("UsageModule", "echoString:" + echoString);
    }

    public static String humanReadableFormat(Duration duration) {
        /**
         * From https://stackoverflow.com/a/40487511/4225094
         * CC BY-SA 3.0
         */
        return duration.toString()
                .substring(2)
                .replaceAll("(\\d[HMS])(?!$)", "$1 ")
                .toLowerCase();
    }
}

package com.screentime;

import android.app.usage.UsageEvents;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.icu.util.Calendar;
import android.util.Log;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.time.Duration;
import java.util.ArrayList;
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

    private class AppUsageInfo {
        Drawable appIcon;
        String appName, packageName;
        long timeInForeground;
        int launchCount;

        AppUsageInfo(String pName) {
            this.packageName=pName;
        }
    }

    /**
     * Method originally referencing and modified from: https://stackoverflow.com/a/45380396/4225094
     * CC BY-SA 3.0
     */
    void getUsageStatistics() {
        // Define a date range of the last 6 hours
        Calendar calendar = Calendar.getInstance();
        long endTime = calendar.getTimeInMillis();
        calendar.add(Calendar.HOUR, -6);
        long startTime = calendar.getTimeInMillis();

        // Get the UsageStatsManager Object to do queries with
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        assert usageStatsManager != null;

        // Query for all events in the given time range
        UsageEvents usageEvents = usageStatsManager.queryEvents(startTime, endTime);

        // Captures all move_to_foreground/background events in a array to compare with next element
        UsageEvents.Event currentEvent;
        List<UsageEvents.Event> allEvents = new ArrayList<>();
        HashMap<String, AppUsageInfo> map = new HashMap<String, AppUsageInfo>();
        while (usageEvents.hasNextEvent()) {
            currentEvent = new UsageEvents.Event();
            usageEvents.getNextEvent(currentEvent);
            // Filter for move_to_foreground/background events
            if (currentEvent.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND ||
                    currentEvent.getEventType() == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                // Store a list of them
                allEvents.add(currentEvent);

                // Also create a map of all events indexed by packageName
                String key = currentEvent.getPackageName();
                if (map.get(key) == null)
                    map.put(key, new AppUsageInfo(key));
            }
        }

        for (UsageEvents.Event e : allEvents) {
            Log.d(TAG, "=== Next Event: ===");
            Log.d(TAG, e.getPackageName());
            Log.d(TAG, e.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND ? "FOREGROUND" : "BACKGROUND");
            Log.d(TAG, String.valueOf(e.getTimeStamp()));
        }
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

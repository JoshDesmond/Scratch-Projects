package com.screentime;

import android.util.Log;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class UsageModule extends ReactContextBaseJavaModule {

    UsageModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "UsageModule";
    }

    @ReactMethod
    public void testCall(String echoString) {
        Log.d("UsageModule", "echoString:" + echoString);
    }
}

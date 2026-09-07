# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile


# --- Added: safe keep rules for enabling minifyEnabled on this Capacitor/Cordova app ---
# Keep Capacitor core + plugin classes (bridged via reflection from JS)
-keep class com.getcapacitor.** { *; }
-keep class * extends com.getcapacitor.Plugin
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
}
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }

# Keep Cordova plugin classes (capacitor-cordova-android-plugins bridge)
-keep class org.apache.cordova.** { *; }
-keep class * extends org.apache.cordova.CordovaPlugin

# Keep WebView JavaScript interfaces
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep annotations generally (needed by several reflection-based libs)
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod

# Don't warn about optional/reflectively-loaded classes from AndroidX/Google libs
-dontwarn androidx.**
-dontwarn com.google.**

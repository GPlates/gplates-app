package earthbyte.gplates.edu;

import android.content.res.Configuration;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import androidx.core.content.ContextCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.media.MediaPlugin;

public class MainActivity extends BridgeActivity {
    public void onCreate() {
        registerPlugin(MediaPlugin.class);
    }

    // Source: https://fellow.engineering/how-we-implemented-dark-mode-with-capacitor-d59b29e51b7d
    @Override
    public void onConfigurationChanged(Configuration configuration) {
        super.onConfigurationChanged(configuration);

        this.updateDarkMode(configuration);
    }

    private void updateDarkMode(Configuration configuration) {
        // read the new night mode value
        int currentNightMode = configuration.uiMode & Configuration.UI_MODE_NIGHT_MASK;
        switch (currentNightMode) {
            case Configuration.UI_MODE_NIGHT_NO:
                forceDarkMode(WebSettingsCompat.FORCE_DARK_AUTO);
                // setBackgroundColor();
                // setStyle("LIGHT");
                break;
            case Configuration.UI_MODE_NIGHT_YES:
                forceDarkMode(WebSettingsCompat.FORCE_DARK_ON);
                // setBackgroundColor();
                // setStyle("DARK");
                break;
        }
    }

    // Update webview theme
    private void forceDarkMode(int mode) {
        // This Dark Mode Strategy sets the css prefers-color-scheme property,
        // instead of trying to automatically convert pages. (Consistent with iOS)
        if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK_STRATEGY)) {
            WebSettingsCompat.setForceDarkStrategy(bridge.getWebView().getSettings(), WebSettingsCompat.DARK_STRATEGY_WEB_THEME_DARKENING_ONLY);
        }
        if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
            WebSettingsCompat.setForceDark(bridge.getWebView().getSettings(), mode);
        }
    }

    public void setStyle(String style) {
        Window window = getWindow();
        View decorView = window.getDecorView();

        WindowInsetsControllerCompat windowInsetsControllerCompat = WindowCompat.getInsetsController(window, decorView);
        windowInsetsControllerCompat.setAppearanceLightNavigationBars(!style.equals("DARK"));
        windowInsetsControllerCompat.setAppearanceLightStatusBars(!style.equals("DARK"));
    }

    public void setBackgroundColor() {
        Window window = getWindow();
         window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
         window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setNavigationBarColor(ContextCompat.getColor(this, R.color.navigationBarColor));
        window.setStatusBarColor(ContextCompat.getColor(this, R.color.navigationBarColor));
    }

    public void onResume() {
        super.onResume();
        updateDarkMode(getResources().getConfiguration());
    }
}

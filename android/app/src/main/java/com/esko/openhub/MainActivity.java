package com.esko.openhub;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class MainActivity extends Activity {
    private WebView webView;
    private Uri siteUri;
    private boolean remoteMode = false;

    private static final Set<String> ALLOWED_PACKAGES = new HashSet<>(Arrays.asList(
            "org.fdroid.fdroid", "net.gsantner.markor", "de.danoeh.antennapod",
            "com.beemdevelopment.aegis", "org.videolan.vlc"
    ));

    private static final String[] CHANNELS = {
            "https://whatsapp.com/channel/0029VbE7vGO4tRrwmz95M73S",
            "https://whatsapp.com/channel/0029VbEH9N2LY6d4aZ8FRW0I",
            "https://whatsapp.com/channel/0029Vb9NAZoKAwEu7UjBxJ02"
    };

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(5, 7, 18));
        setContentView(webView);

        String configured = BuildConfig.ESKO_SITE_URL == null ? "" : BuildConfig.ESKO_SITE_URL.trim();
        if (!configured.isEmpty()) {
            try {
                Uri candidate = Uri.parse(configured);
                if ("https".equalsIgnoreCase(candidate.getScheme()) && candidate.getHost() != null) {
                    siteUri = candidate;
                    remoteMode = true;
                }
            } catch (Exception ignored) { remoteMode = false; }
        }

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setSupportMultipleWindows(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccess(!remoteMode);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSafeBrowsingEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setBlockNetworkImage(false);

        webView.addJavascriptInterface(new ESKOBridge(), "ESKO");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return routeUrl(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return routeUrl(Uri.parse(url));
            }
        });
        webView.setWebChromeClient(new WebChromeClient());

        if (remoteMode) {
            webView.loadUrl(siteUri.toString());
        } else {
            webView.loadUrl("file:///android_asset/index.html");
        }
    }

    private boolean routeUrl(Uri uri) {
        if (uri == null) return true;
        if (!remoteMode && "file".equalsIgnoreCase(uri.getScheme())
                && uri.getPath() != null && uri.getPath().startsWith("/android_asset/")) {
            return false;
        }
        if (remoteMode && "https".equalsIgnoreCase(uri.getScheme())
                && siteUri != null && siteUri.getHost().equalsIgnoreCase(uri.getHost())
                && effectivePort(siteUri) == effectivePort(uri)) {
            return false;
        }
        openExternal(uri.toString());
        return true;
    }

    private int effectivePort(Uri uri) {
        return uri.getPort() > 0 ? uri.getPort() : ("https".equalsIgnoreCase(uri.getScheme()) ? 443 : 80);
    }

    private void openExternal(String url) {
        try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); }
        catch (ActivityNotFoundException ignored) { }
    }

    private class ESKOBridge {
        @JavascriptInterface
        public void openFoss(String packageName) {
            if (packageName == null || !ALLOWED_PACKAGES.contains(packageName)) return;
            runOnUiThread(() -> {
                String url = "https://f-droid.org/packages/" + packageName + "/";
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                intent.setPackage("org.fdroid.fdroid");
                try { startActivity(intent); } catch (ActivityNotFoundException error) { openExternal(url); }
            });
        }

        @JavascriptInterface
        public void openChannel(int index) {
            if (index < 0 || index >= CHANNELS.length) return;
            runOnUiThread(() -> openExternal(CHANNELS[index]));
        }

        @JavascriptInterface
        public void openGithub() {
            runOnUiThread(() -> openExternal("https://github.com/mhmdzhtyashrf-hue"));
        }

        @JavascriptInterface
        public void exitApp() { runOnUiThread(() -> finish()); }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) { webView.stopLoading(); webView.destroy(); webView = null; }
        super.onDestroy();
    }
}

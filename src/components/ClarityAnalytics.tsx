import Script from "next/script";

/** Default project ID; override with NEXT_PUBLIC_CLARITY_PROJECT_ID if needed. */
const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "vvx97jn3ml";

/**
 * Microsoft Clarity — loaded with lazyOnload so it does not compete with LCP
 * or main-thread work during initial paint and hydration.
 */
export default function ClarityAnalytics() {
  if (!CLARITY_PROJECT_ID) {
    return null;
  }

  return (
    <Script id="microsoft-clarity" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(CLARITY_PROJECT_ID)});`}
    </Script>
  );
}

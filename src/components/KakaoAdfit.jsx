import React, { useEffect, useRef } from "react";

const KakaoAdfit = () => {
  const scriptElement = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("src", "https://t1.daumcdn.net/kas/static/ba.min.js");
    script.setAttribute("charset", "utf-8");

    script.setAttribute("async", "true");
    scriptElement.current?.appendChild(script);
  }, []);

  return (
    <div ref={scriptElement}>
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit={"DAN-o1QqjdWa0xJH1Nuk"}
        data-ad-width={"320"}
        data-ad-height={"100"}
      />
    </div>
  );
};

export default KakaoAdfit;
import React from 'react'

function CoupangDynamicBanner({unit }) {
    const unitMapper = {
        introBanner: {
            src: "https://ads-partners.coupang.com/widgets.html?id=854840&template=carousel&trackingCode=AF4787361&subId=&width=300&height=300&tsource=",
            width: 300,
            height: 300
        },
        resultBanner: {
            src: "https://ads-partners.coupang.com/widgets.html?id=854840&template=carousel&trackingCode=AF4787361&subId=&width=300&height=300&tsource=",
            width: 300,
            height: 300
        }
    }
  return (
    <div>
        <iframe 
        src={unitMapper[unit].src}
        width={unitMapper[unit].width}
        height={unitMapper[unit].height}
        frameborder="0" 
        scrolling="no" 
        referrerpolicy="unsafe-url" ></iframe>
    </div>
  )
}

export default CoupangDynamicBanner
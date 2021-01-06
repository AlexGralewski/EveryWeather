import React from "react"

function Footer() {
  return (
    <footer>
      <div>
        Developed by Aleksander Gralewski, 2020
      </div>
      <div style={{display:"none"}}>
        Images credits:
        <a href="https://www.pexels.com/pl-pl/@david-bartus-43782?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels,
">David Bartus</a>
        <a href="https://www.pexels.com/pl-pl/@8moments?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels
">Simon Matzinger</a>
        <a href="https://www.pexels.com/pl-pl/@agata-257956?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels
">Agata</a>
        <a href="https://www.pexels.com/pl-pl/@zhangkaiyv?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels">Zhang kaiyv</a>
      </div>
      <div className="social-icons">
        <a href="https://github.com/AlexGralewski"><i className="fab fa-github"></i></a>
        <a href="https://www.linkedin.com/in/aleksander-gralewski-1a01a7185/"><i className="fab fa-linkedin-in"></i></a>
      </div>
    </footer>
  )
}

export default Footer
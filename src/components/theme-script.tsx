export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem("starwall-theme");var d=document.documentElement;if(t==="dark"){d.classList.add("dark")}else{d.classList.remove("dark")}var l=localStorage.getItem("starwall-locale");if(l){d.lang=l;d.dir=(l==="ar"||l==="he")?"rtl":"ltr"}}catch(e){}})();`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}

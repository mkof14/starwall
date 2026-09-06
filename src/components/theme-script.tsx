export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem("starwall-theme");var d=document.documentElement;if(t==="dark"){d.classList.add("dark")}else{d.classList.remove("dark")}var l=localStorage.getItem("starwall-locale");var ok=["en","es","fr","de","ru","uk","ar","zh","ja","he"];if(l&&ok.indexOf(l)!==-1){d.lang=l;d.dir=(l==="ar"||l==="he")?"rtl":"ltr"}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

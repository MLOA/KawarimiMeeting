// https://qiita.com/mml/items/da6eaf5e906e1d40481d
function init() {
  const input = document.getElementById("filename");
  input.addEventListener(
    "change",
     (event) => {
      const file = event.target.files[0];
      document.querySelector("video").src = URL.createObjectURL(file);
    },
    false
  );
}

init();

document.querySelector("#folder").addEventListener("change", ev => {
  for (let i = 0; i < ev.target.files.length; i++) {
    const file = ev.target.files[i];
    let fileReader = new FileReader();
    const showList = (e) => {
      var p = document.createElement("p");
      p.textContent = file.name;
      document.getElementById("list").insertBefore(p, null);
    };
    fileReader.onload = showList;
    fileReader.readAsDataURL(file);
  }
});

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

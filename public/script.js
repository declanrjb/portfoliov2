(() => {
  // <stdin>
  $(function() {
    $("#stories-more").on("click", function() {
      $("#posts-redacted").css("display", "none");
      $("#posts-full").css("display", "block");
      $("#stories-more").css("display", "none");
      $("#stories-less").css("display", "block");
    });
    $("#stories-less").on("click", function() {
      $("#posts-redacted").css("display", "block");
      $("#posts-full").css("display", "none");
      $("#stories-more").css("display", "block");
      $("#stories-less").css("display", "none");
    });
  });
})();

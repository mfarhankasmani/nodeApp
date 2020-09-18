const deleteProduct = (btn) => {
  const parentNode = btn.parentNode;
  const prodId = parentNode.querySelector("[name=productId]").value;
  const csrf = parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  fetch(`/admin/products/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log({ data });
      //manupulating DOM
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => console.log({ err }));
};

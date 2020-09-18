const deleteProduct = (btn) => {
  const parentNode = btn.parentNode;
  const prodId = parentNode.querySelector("[name=productId]").value;
  const csrf = parentNode.querySelector("[name=_csrf]").value;
  console.log({ prodId, csrf });
};

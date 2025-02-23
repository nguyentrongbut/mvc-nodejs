// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
const formChangeStatus = document.querySelector("#form-change-status");
const path = formChangeStatus.getAttribute("data-path");

if(buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`

            formChangeStatus.action = action;

            formChangeStatus.submit();
        })
    })
}

// End Change Status

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");

if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Are you sure you want to delete this product?");

            if (isConfirm) {
                const id = button.getAttribute("data-id");

                const action = path + `/${id}?_method=DELETE`;

                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
        })
    })
}
// End Delete Item

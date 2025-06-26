import Swal, { SweetAlertIcon, SweetAlertTheme } from "sweetalert2";

const swal = (icon: SweetAlertIcon, title: string, text?: string) => {
    const theme = localStorage.getItem("theme") === "dark" ? "dark" : "light";

    return Swal.mixin({
        theme: theme as SweetAlertTheme,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toastEl) => {
            toastEl.onmouseenter = Swal.stopTimer;
            toastEl.onmouseleave = Swal.resumeTimer;
        },
    }).fire({ icon, title, text });
};

export default swal;

import Swal, { SweetAlertIcon } from "sweetalert2";

const swal = (icon: SweetAlertIcon, title: string, text?: string) => {
    return Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: toastEl => {
            toastEl.onmouseenter = Swal.stopTimer;
            toastEl.onmouseleave = Swal.resumeTimer;
        },
    }).fire({ icon, title, text });
};

export default swal;

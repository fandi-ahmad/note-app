import Swal from 'sweetalert2';

export default
{
    alertSuccess (text) {
        return Swal.fire({
            icon: 'success',
            title: 'Good job',
            text: text
        })
    },

    alertError (text) {
        return Swal.fire({
            icon: 'warning',
            title: 'Error!',
            text: text
        })
    },

    alertConfirm (options) {
        return Swal.fire({
        title: options.title,
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: options.confirmtext
        })
    }
    
}
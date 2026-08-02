export default function AlertMessage({

    type = "success",

    message,

    onClose

}) {

    if (!message) return null;

    return (

        <div className={`alert alert-${type} alert-dismissible fade show`}>

            {message}

            <button

                className="btn-close"

                onClick={onClose}

            ></button>

        </div>

    );

}
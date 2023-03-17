import loading from '../loading.gif'

const Modal = () => {
  
    return (
  
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50">
            <div className="flex h-screen justify-center items-center ">
                <div className="flex-col justify-center bg-white py-12 px-24 rounded-xl ">
                    <img className="mx-auto mb-4 w-40" alt="" src={loading}></img>
                    <div className="flex text-xl font-semibold text-black" >Transaction in Progress ...</div>
                </div>
            </div>
        </div>
  
    );
  }
  
  export default Modal
  
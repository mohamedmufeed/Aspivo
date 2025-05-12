
import { Ban } from 'lucide-react';
import React from 'react';
interface PropType {
    userId: string;
    onClose: () => void;
    onConfirmBlock: (userId: string) => void;
}

const AdminApproveToast: React.FC<PropType> = ({ onClose ,onConfirmBlock, userId }) => {
    return (

        <div id="toast-interactive" className=" absolute w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:bg-white dark:text-gray-400 items-center pt-5" role="alert">
            <div className="flex">
                <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-white dark:bg-orange-600" >
                    <Ban />
                    <span className="sr-only">Refresh icon</span>
                </div>
                <div className="ms-3 text-sm font-normal">
                    <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-black">Are you sure ?</span>
                    <div className="mb-2 text-sm font-normal">The user won't be able to access their account until unblocked..</div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <a href="#" className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:ring-4 focus:outline-none  dark:bg-orange-600 dark:hover:bg-orange-700 "
                                onClick={() => {
                                    onConfirmBlock(userId);
                                    onClose();
                                }}
                            >Confirm</a>
                        </div>
                        <div>
                            <a href="#" className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100  dark:bg-white-600 dark:text-black dark:border-gray-600" onClick={onClose}>Not now</a>
                        </div>
                    </div>
                </div>
                <button type="button" onClick={onClose} className="ms-auto -mx-1.5 -my-1.5 bg-white items-center justify-center shrink-0 text-gray-400 hover:text-gray-900 rounded-lg  p-1.5 hover:bg-gray-300 inline-flex h-8 w-8 dark:text-black  " data-dismiss-target="#toast-interactive" aria-label="Close" >
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </div>
        </div>


    )
}

export default AdminApproveToast
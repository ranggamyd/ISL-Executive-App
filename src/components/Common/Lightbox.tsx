import { X } from "lucide-react";

const Lightbox = ({ image, title, onClose }: { image: string; title: string; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" style={{ marginTop: 0 }} onClick={onClose}>
            <div className="relative max-w-4xl max-h-[90vh] p-4">
                <button onClick={onClose} className="absolute -top-10 right-2 text-white hover:text-gray-300 text-2xl font-bold">
                    <X size={32} />
                </button>

                <img src={image} alt={title} className="max-w-full max-h-full object-contain rounded-lg" onClick={e => e.stopPropagation()} />

                {title && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lightbox;

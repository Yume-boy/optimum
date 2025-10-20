import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Package, MapPin, Calendar, Shield, Upload, DollarSign } from 'lucide-react';
import { useFetchResourceQuery, useCreateResourceMutation } from '@/redux/api/crudApi';


// Define the shape of the form data, aligning with the UI inputs
interface BookingFormData {
  pickupAddress: string;
  deliveryAddress: string;
  category: string;
  weight: number; // Number for form input, will be converted to "Xkg" string for API
  quantity: number;
  scheduledDate?: string;
  isImmediate: 'true' | 'false'; // Radio button value
  hasInsurance: boolean;
  specialInstructions?: string;
}

// Simple Modal Component to replace alert() and confirm()
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="text-gray-700 mb-6">{children}</div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingForm: React.FC = () => {


  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  // State for submission feedback
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackModalTitle, setFeedbackModalTitle] = useState('');
  const [feedbackModalMessage, setFeedbackModalMessage] = useState('');
  const [createOrder, {isLoading}] = useCreateResourceMutation()

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<BookingFormData>({
    defaultValues: {
      isImmediate: 'true', // Default to immediate delivery
      weight: 0,
      quantity: 1,
      hasInsurance: false,
    }
  });

  const isImmediate = watch('isImmediate');
  const weight = watch('weight');
  const hasInsurance = watch('hasInsurance');

  // Calculate estimated price based on weight and insurance
  useEffect(() => {
    if (weight !== undefined) { // Ensure weight is defined before calculation
      const basePrice = 15;
      const weightPrice = weight * 2.5;
      const insurancePrice = hasInsurance ? 5 : 0;
      setEstimatedPrice(basePrice + weightPrice + insurancePrice);
    }
  }, [weight, hasInsurance]);

  const onSubmit = async (data: BookingFormData) => {
    if (estimatedPrice <= 0) {
      setFeedbackModalTitle("Invalid Price");
      setFeedbackModalMessage("Estimated price must be greater than 0. Please check weight and quantity.");
      setShowFeedbackModal(true);
      return;
    }

    setSubmissionStatus('loading');
    setSubmissionError(null);

    const user_id =sessionStorage.getItem('user_id')

    // Map form data to the Order interface required by addOrder thunk
    const orderPayload = {
      // user_id: user_id, // From Redux state
      pickup_address: data.pickupAddress,
      delivery_address: data.deliveryAddress,
      // category: data.category,
      // weight: `${data.weight}kg`, // Convert number to "Xkg" string
      // quantity: data.quantity,
      description: data.specialInstructions || '',
      // delivery_type: data.isImmediate === 'true' ? 'immediate' : 'scheduled',
      // recipient_id: uploadedFile ? uploadedFile.name : '', // Using file name as ID/URL placeholder
      amount: estimatedPrice, // From calculated state
      // status: 'pending', // Default status for new orders
      // driver_id: null, // No driver assigned initially
    };

    try {
        await createOrder({
          data: orderPayload,
          url: '/orders/create'
        }).unwrap()

        setSubmissionStatus('succeeded');
        setFeedbackModalTitle("Order Placed!");
        setFeedbackModalMessage("Your delivery order has been successfully placed.");
        setShowFeedbackModal(true);
        reset(); // Reset form fields
        setUploadedFile(null); // Clear uploaded file state
        setEstimatedPrice(0); // Reset price
    } catch (err: any) {
      setSubmissionStatus('failed');
      const errorMessage = err.message || 'An unexpected error occurred.';
      setSubmissionError(errorMessage);
      setFeedbackModalTitle("Error");
      setFeedbackModalMessage(errorMessage);
      setShowFeedbackModal(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Documents',
    'Food',
    'Furniture',
    'Medical',
    'Books',
    'Other'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Package className="h-8 w-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">Book a Delivery</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Delivery Type */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <input
                {...register('isImmediate')}
                type="radio"
                value="true"
                id="immediate-delivery"
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <div>
                <label htmlFor="immediate-delivery" className="font-medium text-gray-900">Immediate Delivery</label>
                <p className="text-sm text-gray-600">Delivery within 2-4 hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <input
                {...register('isImmediate')}
                type="radio"
                value="false"
                id="scheduled-delivery"
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <div>
                <label htmlFor="scheduled-delivery" className="font-medium text-gray-900">Scheduled Delivery</label>
                <p className="text-sm text-gray-600">Choose your preferred date & time</p>
              </div>
            </div>
          </div> */}

          {/* Scheduled Date */}
          {isImmediate === 'false' && ( // Check for string 'false'
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date & Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('scheduledDate', { required: isImmediate === 'false' ? 'Scheduled date is required' : false })}
                  type="datetime-local"
                  id="scheduledDate"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              {errors.scheduledDate && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>
              )}
            </div>
          )}

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  {...register('pickupAddress', { required: 'Pickup address is required' })}
                  rows={3}
                  id="pickupAddress"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter pickup address"
                />
              </div>
              {errors.pickupAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  {...register('deliveryAddress', { required: 'Delivery address is required' })}
                  rows={3}
                  id="deliveryAddress"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter delivery address"
                />
              </div>
              {errors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
              )}
            </div>
          </div>

          {/* Package Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                id="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div> */}

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                {...register('weight', { required: 'Weight is required', min: { value: 0.1, message: 'Weight must be greater than 0' } })}
                type="number"
                step="0.1"
                id="weight"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.0"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Quantity must be at least 1' } })}
                type="number"
                id="quantity"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="1"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Insurance */}
          {/* <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <input
              {...register('hasInsurance')}
              type="checkbox"
              id="hasInsurance"
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <Shield className="h-5 w-5 text-yellow-600" />
            <div>
              <label htmlFor="hasInsurance" className="font-medium text-gray-900">Package Insurance</label>
              <p className="text-sm text-gray-600">Protect your package for an additional $5</p>
            </div>
          </div> */}

          {/* File Upload */}
          {/* <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Receipt/ID (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="font-medium text-emerald-600 hover:text-emerald-500">
                    Click to upload
                  </span>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="mt-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF up to 10MB</p>
              {uploadedFile && (
                <p className="mt-2 text-sm text-emerald-600">
                  Uploaded: {uploadedFile.name}
                </p>
              )}
            </div>
          </div> */}

          {/* Special Instructions */}
          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              {...register('specialInstructions')}
              rows={3}
              id="specialInstructions"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Any special handling instructions..."
            />
          </div>

          {/* Price Estimation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Estimated Price</span>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                ₦{estimatedPrice.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Base price: ₦15.00</p>
              <p>Weight charge: ₦{((weight || 0) * 2.5).toFixed(2)}</p>
              {hasInsurance && <p>Insurance: ₦5.00</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            disabled={submissionStatus === 'loading'}
          >
            {submissionStatus === 'loading' ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {submissionStatus === 'loading' ? 'Booking...' : `Book Delivery - ₦${estimatedPrice.toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* Feedback Modal */}
      <Modal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
        title={feedbackModalTitle}
      >
        <p>{feedbackModalMessage}</p>
      </Modal>
    </div>
  );
};

export default BookingForm;

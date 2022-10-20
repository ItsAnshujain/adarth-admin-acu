import { Link } from 'react-router-dom';
import image1 from '../../assets/image1.png';
import pdf from '../../assets/pdf.svg';

const Profile = () => (
  <>
    <div className="h-[60px] flex justify-end items-center border-b pr-7">
      <Link to="/edit-profile">
        <button
          type="button"
          className=" text-white p-2 px-4 font-thin text-sm bg-purple-450 rounded-lg"
        >
          Edit
        </button>
      </Link>
    </div>
    <div className="pl-5 pr-7 flex justify-between mt-8 mb-8">
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex gap-4">
            <div>
              <img src={image1} alt="profile pic" />
            </div>
            <div className="flex flex-col">
              <p className="text-xl font-bold">Peter Williams</p>
              <p className="text-[#914EFB]">Management</p>
              <p>Adarth</p>
            </div>
          </div>
          <div>
            <p>
              But I must explain to you how all this mistaken idea of denouncing pleasure and
              praising pain was born and I will give you a complete account of the system, and
              expound the actual teachings of the great explorer of the truth, the master-builder of
              human happiness.{' '}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Email</p>
            <p className="font-semibold">peter@adarthgmail.com</p>
          </div>
          <div>
            <p className="text-slate-400">Phone</p>
            <p className="font-semibold">+91 987542134</p>
          </div>
          <div>
            <p className="text-slate-400">Address</p>
            <p className="font-semibold">Hedy Greene Ap #696-3279 Viverra. Avenue Latrobe DE </p>
          </div>
          <div>
            <p className="text-slate-400">City</p>
            <p className="font-semibold">Madrid</p>
          </div>
          <div>
            <p className="text-slate-400">Pincode</p>
            <p className="font-semibold">43455513</p>
          </div>
          <div>
            <p className="text-slate-400">Pan</p>
            <p className="font-semibold">ABCD1234561</p>
          </div>
          <div>
            <p className="text-slate-400">Aadhar</p>
            <p className="font-semibold">4441-4221-3561-0548</p>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col">
            <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
              <div className="flex justify-center flex-col">
                <img src={pdf} alt="" className="h-8" />
                <p className="text-sm font-medium">license.pdf</p>
              </div>
            </div>
            <div className="text-sm mt-2">
              <p className="font-medium">Landlord License</p>
              <p className="text-slate-400">Your landlord license photocopy</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
              <div className="flex justify-center flex-col">
                <img src={pdf} alt="" className="h-8" />
                <p className="text-sm font-medium">license.pdf</p>
              </div>
            </div>
            <div className="text-sm mt-2">
              <p className="font-medium">Landlord License</p>
              <p className="text-slate-400">Your landlord license photocopy</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col ">
            <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
              <div className="flex justify-center flex-col">
                <img src={pdf} alt="" className="h-8" />
                <p className="text-sm font-medium">license.pdf</p>
              </div>
            </div>
            <div className="text-sm mt-2">
              <p className="font-medium">Landlord License</p>
              <p className="text-slate-400">Your landlord license photocopy</p>
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
              <div className="flex justify-center flex-col">
                <img src={pdf} alt="" className="h-8" />
                <p className="text-sm font-medium">license.pdf</p>
              </div>
            </div>
            <div className="text-sm mt-2">
              <p className="font-medium">Landlord License</p>
              <p className="text-slate-400">Your landlord license photocopy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Profile;

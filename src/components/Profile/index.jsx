import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import image1 from '../../assets/image1.png';
// import pdf from '../../assets/pdf.svg';
import useUserStore from '../../store/user.store';
import { aadhaarFormat } from '../../utils';

const Profile = () => {
  const userId = useUserStore(state => state.id);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['users-by-id', userId]);

  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (data) {
      const finalObject = {};
      if (data.docs.find(item => Object.keys(item)[0] === 'landlordLicense')) {
        finalObject.landlordLicense = data.docs.find(
          item => Object.keys(item)[0] === 'landlordLicense',
        ).landlordLicense;
      }
      if (data.docs.find(item => Object.keys(item)[0] === 'aadhaar')) {
        finalObject.aadhaar = data.docs.find(item => Object.keys(item)[0] === 'aadhaar').aadhaar;
      }
      if (data.docs.find(item => Object.keys(item)[0] === 'pan')) {
        finalObject.pan = data.docs.find(item => Object.keys(item)[0] === 'pan').pan;
      }
      setDocs({ ...finalObject });
    }
  }, [data]);

  return (
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
                <img src={data?.image || image1} alt="profile pic" />
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-bold">{data?.name || 'N/A'}</p>
                <p className="text-[#914EFB]">{data?.role || 'N/A'}</p>
                <p>{data?.company}</p>
              </div>
            </div>
            <div>
              <p>{data?.about}</p>
            </div>
            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-semibold">{data?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400">Phone</p>
              <p className="font-semibold">{data?.number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400">Address</p>
              <p className="font-semibold">{data?.address || 'N/A'} </p>
            </div>
            <div>
              <p className="text-slate-400">City</p>
              <p className="font-semibold">{data?.city || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400">Pincode</p>
              <p className="font-semibold">{data?.pincode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400">Pan</p>
              <p className="font-semibold">{data?.pan || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400">Aadhaar</p>
              <p className="font-semibold">{aadhaarFormat(data?.aadhaar || '') || 'N/A'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {docs.landlordLicense ? (
              <div className="flex flex-col">
                <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
                  <div className="flex justify-center flex-col h-full w-full">
                    <img
                      src={docs.landlordLicense}
                      alt="landlordLicense"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-sm mt-2">
                  <p className="font-medium">Landlord License</p>
                  <p className="text-slate-400">Your landlord license photocopy</p>
                </div>
              </div>
            ) : null}
            {docs.aadhaar ? (
              <div className="flex flex-col">
                <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
                  <div className="flex justify-center flex-col h-full w-full">
                    <img
                      src={docs.aadhaar}
                      alt="aadhaar"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-sm mt-2">
                  <p className="font-medium">Aadhaar</p>
                  <p className="text-slate-400">Your aadhaar card photocopy</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-8">
            {docs.pan ? (
              <div className="flex flex-col ">
                <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
                  <div className="flex justify-center flex-col h-full w-full">
                    <img src={docs.pan} alt="pan" className="h-full w-full object-contain" />
                  </div>
                </div>
                <div className="text-sm mt-2">
                  <p className="font-medium">Pan</p>
                  <p className="text-slate-400">Your pan card photocopy</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

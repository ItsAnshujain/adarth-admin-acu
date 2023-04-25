import React from 'react';
import { Image, Skeleton } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import PreviewCard from '../Create/UI/PreviewCard';
import UserImage from '../../../assets/placeholders/user.png';

const OverviewUserDetails = ({ userDetails, isUserDetailsLoading = false }) => (
  <div className="pl-5 flex justify-between mt-8 mb-8">
    <div className="grid grid-cols-4 gap-8">
      <div className="flex flex-col col-span-1 gap-8">
        {!isUserDetailsLoading ? (
          <div className="flex gap-4">
            <div>
              <Image
                src={userDetails?.image || UserImage}
                alt="profile pic"
                height={120}
                width={120}
                className="bg-gray-450 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-xl font-bold">{userDetails?.name || 'NA'}</p>
              <p className="text-[#914EFB] capitalize">{userDetails?.role || 'NA'}</p>
              <p>{userDetails?.company || 'NA'}</p>
            </div>
          </div>
        ) : (
          <Skeleton height={180} width={270} radius="sm" />
        )}
        {!isUserDetailsLoading ? (
          <>
            <div>
              <p>{userDetails?.about || 'NA'}</p>
            </div>
            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-semibold">{userDetails?.email || 'NA'}</p>
            </div>
            <div>
              <p className="text-slate-400">Phone</p>
              <p className="font-semibold">+91 {userDetails?.number || 'NA'}</p>
            </div>
            <div>
              <p className="text-slate-400">Address</p>
              <p className="font-semibold">{userDetails?.address || 'NA'}</p>
            </div>
            <div>
              <p className="text-slate-400">City</p>
              <p className="font-semibold">{userDetails?.city || 'NA'}</p>
            </div>
            <div>
              <p className="text-slate-400">Pincode</p>
              <p className="font-semibold">{userDetails?.pincode || 'NA'}</p>
            </div>
            <div>
              <p className="text-slate-400">Pan</p>
              <p className="font-semibold">{userDetails?.pan || 'NA'}</p>
            </div>
            <div>
              <p className="text-slate-400">Aadhar</p>
              <p className="font-semibold">{userDetails?.aadhaar || 'NA'}</p>
            </div>
          </>
        ) : (
          <Skeleton height={500} width={270} radius="sm" />
        )}
      </div>
      {!userDetails ? (
        <>
          <Skeleton height={180} width={290} radius="sm" />
          <Skeleton height={180} width={290} radius="sm" />
          <Skeleton height={180} width={290} radius="sm" />
        </>
      ) : null}
      {userDetails?.docs?.map(doc => (
        <div className="flex flex-col col-span-1" key={uuidv4()}>
          <PreviewCard
            filename={doc}
            cardText={doc}
            cardSubtext={doc}
            showTrashBtn={false}
            preview
            fileExtensionType={doc?.aadhaar || doc?.pan}
          />
        </div>
      ))}
    </div>
  </div>
);

export default OverviewUserDetails;

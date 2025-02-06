import { BsGlobe, BsFillTelephoneFill, BsEnvelopeFill, BsFillPinMapFill } from 'react-icons/bs';

import { IProfiles } from 'src/stores/basic.interface';
import React from 'react';
import { socialIcons } from 'src/helpers/icons';
import { ProfileName } from '@/templates/modern/atoms/ProfileName';
import { SectionSubtitle } from '@/templates/modern/atoms/SectionSubtitle';
import { ProfileContact } from '@/templates/modern/atoms/ProfileContact';
import { ProfileImage } from '@/helpers/common/components/ProfileImage';

function SocialIcons({ profiles }: { profiles: IProfiles[] }) {
  return (
    <div className="social-icons flex">
      {profiles.map((profile) => {
        const Icon = socialIcons.get(profile.network);

        return (
          Icon &&
          profile.url && (
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
              key={profile.network}
            >
              <Icon className="h-5 w-5 bg-white" />
            </a>
          )
        );
      })}
    </div>
  );
}
export const BasicIntro = ({
  name,
  label,
  url,
  email,
  phone,
  city,
  image,
  profiles,
}: {
  name: string;
  label: string;
  url: string;
  email: string;
  phone: string;
  city: string;
  image: string;
  profiles?: IProfiles[];
}) => {
  const isProfileLinkAvailable =
    profiles &&
    profiles.some((profile) => (profile.url.length > 0 ? true : false)) &&
    !image.length;
  return (
    <div
      className={`flex justify-between ${
        isProfileLinkAvailable ? 'items-end' : 'items-center'
      }  p-4`}
    >
      <div className="flex w-[58%] gap-3 items-center">
        <ProfileImage src={image} height="100px" width="100px" />
        <div className="w-full">
          <ProfileName name={name} />
          <SectionSubtitle label={label} />
        </div>
      </div>
      <div className="w-[38%] flex justify-start">
        <div className=" gap-4 space-y-1">
          {/* <ProfileContact text={phone} />
          <ProfileContact text={email} />
          <ProfileContact text={city} /> */}
          {phone && (
            <div className="flex gap-2  items-center">
              <BsFillTelephoneFill />
              <ProfileContact text={phone} />
            </div>
          )}
          {email && (
            <div className="flex gap-2  items-center">
              <BsEnvelopeFill />
              <ProfileContact text={email} />
            </div>
          )}
          {city && (
            <div className="flex gap-2  items-center">
              <BsFillPinMapFill />
              <ProfileContact text={city} />
            </div>
          )}
          {url && (
            <div className="flex gap-2  items-center">
              <BsGlobe />
              <ProfileContact text={url} />
            </div>
          )}
        </div>
      </div>
      {isProfileLinkAvailable && <SocialIcons profiles={profiles} />}
    </div>
  );
};

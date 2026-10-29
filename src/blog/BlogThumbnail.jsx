import React from 'react';
import {
  SpeakerWaveIcon,
  CodeBracketIcon,
  EyeIcon,
  SparklesIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

const ICONS = {
  speaker: SpeakerWaveIcon,
  code: CodeBracketIcon,
  eye: EyeIcon,
  sparkles: SparklesIcon,
  bulb: LightBulbIcon,
};

// Simple gradient thumbnail with an icon — no external images to break.
const BlogThumbnail = ({ icon, gradient, className = 'w-full sm:w-52 h-36 sm:h-[8.5rem]' }) => {
  const Icon = ICONS[icon] || SparklesIcon;
  return (
    <div
      aria-hidden="true"
      className={`bg-gradient-to-br ${gradient} ${className} rounded-xl flex items-center justify-center shrink-0`}
    >
      <Icon className="h-12 w-12 text-white/80" />
    </div>
  );
};

export default BlogThumbnail;

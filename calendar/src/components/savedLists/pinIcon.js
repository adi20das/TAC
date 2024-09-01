export default function PinIcon() {
  return (
    <svg
      width="42"
      height="45"
      viewBox="0 0 42 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dd_51_14)">
        <path
          d="M20.9999 36.6667C30.2047 36.6667 37.6666 29.2048 37.6666 20C37.6666 10.7953 30.2047 3.33337 20.9999 3.33337C11.7952 3.33337 4.33325 10.7953 4.33325 20C4.33325 29.2048 11.7952 36.6667 20.9999 36.6667Z"
          fill="#2FB0F9"
          stroke="black"
          stroke-width="0.25"
          stroke-linejoin="round"
        />
        <path
          d="M13.0764 20.4166H28.0764"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M20.5764 12.9166L28.0764 20.4166L20.5764 27.9166"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_51_14"
          x="-3"
          y="0"
          width="48"
          height="48"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_51_14"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_51_14"
            result="effect2_dropShadow_51_14"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_51_14"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

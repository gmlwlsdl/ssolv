const PersonaCardLockedOverlay = () => {
  return (
    <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center gap-3 bg-white/50 backdrop-blur-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M23.9999 10.6668H22.6666V8.00016C22.6666 4.32016 19.6799 1.3335 15.9999 1.3335C12.3199 1.3335 9.33325 4.32016 9.33325 8.00016V10.6668H7.99992C6.53325 10.6668 5.33325 11.8668 5.33325 13.3335V26.6668C5.33325 28.1335 6.53325 29.3335 7.99992 29.3335H23.9999C25.4666 29.3335 26.6666 28.1335 26.6666 26.6668V13.3335C26.6666 11.8668 25.4666 10.6668 23.9999 10.6668ZM15.9999 22.6668C14.5333 22.6668 13.3333 21.4668 13.3333 20.0002C13.3333 18.5335 14.5333 17.3335 15.9999 17.3335C17.4666 17.3335 18.6666 18.5335 18.6666 20.0002C18.6666 21.4668 17.4666 22.6668 15.9999 22.6668ZM11.9999 10.6668V8.00016C11.9999 5.78683 13.7866 4.00016 15.9999 4.00016C18.2133 4.00016 19.9999 5.78683 19.9999 8.00016V10.6668H11.9999Z"
          fill="#3A3D42"
        />
      </svg>
      <p className="text-center body-3 font-semibold whitespace-pre-line text-neutral-1400">{`취향 설문에 참여하고\n 모임원의 결과를 확인해보세요`}</p>
    </div>
  );
};

export default PersonaCardLockedOverlay;

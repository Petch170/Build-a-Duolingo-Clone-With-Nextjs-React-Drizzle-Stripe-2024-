import MobileSidebar from "./mobilesidebar";

const MobileHeader = () => {
  return (
    <nav className=" lg:hidden px-6 h-[50px] flex items-center border-b fixed top-0 w-full bg-green-500 z-50">
      <MobileSidebar />
    </nav>
  );
};

export default MobileHeader;

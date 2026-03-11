const TradingSection = () => {
  return (
    <section className="bg-black py-20 relative overflow-hidden z-10">
      {/* Glowing line effect */}
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm opacity-40"></div>
      </div>



      {/* Bottom gradient effect */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
    </section>
  );
};

export default TradingSection;

import React from 'react';

const StudentReviews = () => {
  const reviews = [
    {
      name: 'Arjun Mehta',
      role: 'Full Stack Developer',
      rating: 5,
      review: 'The DevOps course was a game changer for my career. The hands-on labs were incredibly helpful.',
      image: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=0D8ABC&color=fff'
    },
    {
      name: 'Zara Khan',
      role: 'Cloud Engineer',
      rating: 5,
      review: 'Excellent curriculum! The instructors explained complex AWS concepts in a very simple way.',
      image: 'https://ui-avatars.com/api/?name=Zara+Khan&background=f26522&color=fff'
    },
    {
      name: 'David Wilson',
      role: 'System Admin',
      rating: 4,
      review: 'Great transition from SysAdmin to DevOps. The Linux and Docker modules are top-notch.',
      image: 'https://ui-avatars.com/api/?name=David+Wilson&background=ff6c37&color=fff'
    },
    {
      name: 'Neha Choudhury',
      role: 'Backend Developer',
      rating: 5,
      review: 'I loved the project-based approach. Building a CI/CD pipeline from scratch was the best part.',
      image: 'https://ui-avatars.com/api/?name=Neha+Choudhury&background=4285f4&color=fff'
    },
    {
      name: 'Rahul Nair',
      role: 'DevOps Engineer',
      rating: 5,
      review: 'Highly recommended for anyone looking to switch to DevOps. The support team is also very responsive.',
      image: 'https://ui-avatars.com/api/?name=Rahul+Nair&background=00a4ef&color=fff'
    },
    {
      name: 'Jessica Taylor',
      role: 'Software Engineer',
      rating: 5,
      review: 'The best investment I made for my career. The networking and security modules were very detailed.',
      image: 'https://ui-avatars.com/api/?name=Jessica+Taylor&background=ff9900&color=fff'
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="w-full overflow-hidden py-8">
      <div className="relative w-full overflow-hidden">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-gray-800 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-gray-800 to-transparent pointer-events-none" />

        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {/* First set of reviews */}
          <div className="flex items-center space-x-6 mx-4">
            {reviews.map((review, index) => (
              <div key={`review-1-${index}`} className="w-80 md:w-96 bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors duration-300 flex-shrink-0 whitespace-normal">
                <div className="flex items-center mb-4">
                  <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h4 className="text-white font-semibold">{review.name}</h4>
                    <p className="text-gray-400 text-xs">{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "{review.review}"
                </p>
              </div>
            ))}
          </div>

          {/* Duplicate set for infinite scroll */}
          <div className="flex items-center space-x-6 mx-4">
            {reviews.map((review, index) => (
              <div key={`review-2-${index}`} className="w-80 md:w-96 bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors duration-300 flex-shrink-0 whitespace-normal">
                <div className="flex items-center mb-4">
                  <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h4 className="text-white font-semibold">{review.name}</h4>
                    <p className="text-gray-400 text-xs">{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "{review.review}"
                </p>
              </div>
            ))}
          </div>
          
           {/* Triplicate set for infinite scroll safety */}
           <div className="flex items-center space-x-6 mx-4">
            {reviews.map((review, index) => (
              <div key={`review-3-${index}`} className="w-80 md:w-96 bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors duration-300 flex-shrink-0 whitespace-normal">
                <div className="flex items-center mb-4">
                  <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h4 className="text-white font-semibold">{review.name}</h4>
                    <p className="text-gray-400 text-xs">{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "{review.review}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-reverse {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StudentReviews;

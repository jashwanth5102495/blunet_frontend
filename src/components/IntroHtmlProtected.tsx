import Header from './Header';
import { ProtectedStudentCourseGate } from './AuthWrappers';
const htmlpart1 = '/htmlpart1.mp4';
const htmlpart2 = '/htmlpart2.mp4';

// Unique per-student URL for Frontend Beginner: plays Introduction to HTML videos
const IntroHtmlProtected = () => {
  const content = (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Introduction to HTML</h1>
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-semibold mb-3">Part 1</h2>
              <video className="w-full max-w-3xl rounded-lg border border-gray-200" controls src={htmlpart1}></video>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Part 2</h2>
              <video className="w-full max-w-3xl rounded-lg border border-gray-200" controls src={htmlpart2}></video>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ProtectedStudentCourseGate requiredCourseId="frontend-beginner">
      {content}
    </ProtectedStudentCourseGate>
  );
}

export default IntroHtmlProtected;

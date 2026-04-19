function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-blue-600 mb-10">
        Contact Us
      </h2>

      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10">
        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
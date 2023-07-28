'use client';
import axios from 'axios';
import { useState } from 'react';


const Footer = () => {

  const [email, setEmail] = useState('');

  const handleChange = (event: any) => {
    setEmail(event.target.value);
  };

  const addContact = async () => {
    const options = {
      method: 'POST',
      url: 'https://api.brevo.com/v3/contacts',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY
      },
      data: {
        email: email,
        emailBlacklisted: false,
        smsBlacklisted: false,
        listIds: [3],
        updateEnabled: false,
      }
    };

    const response = await axios.request(options)
    setEmail('');
  }

  return (
    <footer className="relative w-full h-fit flex flex-col items-center justify-between pt-10">
      <div>
        <h1 className="text-gray text-center">
          <p className="text-4xl font-lora">Let the <span className="font-bold">Kraken</span></p>
          <p className="text-4xl mt-1 font-lora">catch <span className="font-bold">YOU</span></p>
        </h1>
      </div>

      <div className="w-full lg:w-1/3 mt-8 flex flex-col items-center px-10" id="newsletter">
        <h2 className="text-white text-4xl">
          Newsletter
        </h2>
        <input type="email" onChange={handleChange} className="rounded-[0.75rem] text-center mt-3 px-3 py-2 bg-gray text-gray-100 w-full" placeholder="Introduce email adress" />
        <button onClick={addContact} className="rounded-[0.75rem] bg-turquoise-400 text-black text-3xl mt-5 px-3 py-2 w-full font-semibold">
          Sign Up!
        </button>
      </div>

      <div className="mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="390" height="329" viewBox="0 0 390 329" fill="none">
          <path d="M35.8817 138.327H0V328.5H389.5V138.327H350.15C355.207 133.058 356.923 128.134 357.149 126.331C361.484 113.158 358.955 104.219 357.149 101.396C343.964 79.379 325.165 74.6587 317.414 75.0507C312.297 75.2076 299.849 77.1678 290.999 83.7543C282.149 90.3407 277.077 103.121 275.647 108.689C276.324 104.925 276.685 94.6689 272.712 83.7543C267.745 70.111 243.362 51.7631 231.396 42.8243C221.824 35.6734 219.13 27.1424 218.979 23.7708C220.56 3.0706 233.88 0.483117 223.946 0.483117C214.012 0.483117 208.368 8.71611 203.401 17.8901C199.428 25.2292 199.789 34.1209 200.466 37.6493L195.048 33.6504L188.501 37.6493C189.584 30.122 185.34 21.3401 183.082 17.8901C180.298 13.4207 173.103 3.68223 166.601 0.483117C160.099 -2.716 163.892 10.7548 166.601 17.8901C167.655 21.1833 168.046 29.7456 161.183 37.6493C152.604 47.529 128.446 68.6996 119.416 79.7554C112.191 88.6 111.138 102.729 111.514 108.689C108.88 101.788 100.722 87.1416 89.1629 83.7543L88.5485 83.5742C74.6271 79.4936 71.5651 78.5961 56.8781 79.7554C44.9576 80.6963 34.9034 94.5748 31.3663 101.396C30.087 105.003 27.7089 114.428 28.4314 123.273C29.1538 132.117 33.6993 136.994 35.8817 138.327Z" fill="#043D40"/>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;

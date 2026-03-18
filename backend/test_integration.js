const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:4000/api/predict', {
      loan_amnt: 15000,
      annual_inc: 60000,
      int_rate: 10.5,
      term: 36,
      dti: 15,
      fico: 720
    });
    console.log("SUCCESS! Response from Node Backend (which called Python ML):")
    console.log(res.data);
  } catch(e) {
    console.error("FAIL:", e.response ? e.response.data : e.message);
  }
}

test();

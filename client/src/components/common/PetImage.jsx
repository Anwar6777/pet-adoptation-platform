const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22%3E%3Crect width=%22800%22 height=%22600%22 fill=%22%23fff7ed%22/%3E%3Ccircle cx=%22400%22 cy=%22255%22 r=%22118%22 fill=%22%23ffedd5%22/%3E%3Cpath d=%22M310 210l-55-75q-18-25-37-5t5 42l55 65m212-27 55-75q18-25 37-5t-5 42l-55 65%22 fill=%22%23f4b183%22/%3E%3Ccircle cx=%22360%22 cy=%22245%22 r=%2212%22 fill=%22%235b4636%22/%3E%3Ccircle cx=%22440%22 cy=%22245%22 r=%2212%22 fill=%22%235b4636%22/%3E%3Cellipse cx=%22400%22 cy=%22285%22 rx=%2223%22 ry=%2216%22 fill=%22%235b4636%22/%3E%3Ctext x=%22400%22 y=%22475%22 text-anchor=%22middle%22 font-family=%22Arial,sans-serif%22 font-size=%2230%22 font-weight=%22bold%22 fill=%22%237c5b45%22%3EPawConnect%3C/text%3E%3C/svg%3E';

function PetImage({ src, alt = 'Pet', ...props }) {
  return <img {...props} src={src || FALLBACK_IMAGE} alt={alt} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGE; }} />;
}

export default PetImage;

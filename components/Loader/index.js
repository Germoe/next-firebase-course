import loaderStyles from './Loader.module.css'

// Loading Spinner
export default function Loader({ show }) {
    return show ? <div className={loaderStyles.loader}></div> : null;
}
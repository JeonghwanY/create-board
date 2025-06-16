// const Button = (props) =>{
//     return <button>{props.text}</button>
// }

const Button =({text, color = 'balck'}) => { //props 
    return (
        <button style={{color:color}}>
            {text}-{color.toUpperCase()}
        </button>
    );
};

export default Button;
export const API_KEY = 'AIzaSyBzm2dfUtUsVkjBI6vlbL7x7dWUxbCW2vw'

const valueConverter = (value) => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    } else {
        return value.toString();
    }
}

export default valueConverter ;

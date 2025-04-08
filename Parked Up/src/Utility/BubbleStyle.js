/**
 * BubbleStyle Function
 *
 * A utility function that returns a style object for a bubble indicating the availability of carpark lots.
 * The bubble's background color changes based on the availability value, with green for lots greater than 15,
 * orange for lots between 6 and 15, and red for 5 or fewer.
 * This style is typically used in components that display a visual indicator of the number of available lots.
 *
 * @param {number} availability - The number of available lots in the carpark.
 * @returns {Object} A style object that defines the appearance of the bubble, including background color, size, and text alignment.
 */
export const BubbleStyle = (availability) => ({
  backgroundColor: availability > 15 ? 'green' : availability > 5 ? 'orange' : 'red',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '50%',
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
});

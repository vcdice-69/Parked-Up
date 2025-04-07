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
  
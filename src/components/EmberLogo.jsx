export default function EmberLogo({ size = 160 }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}EmberRoboticsLogoOrange.png`}
      alt="Ember Robotics"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}

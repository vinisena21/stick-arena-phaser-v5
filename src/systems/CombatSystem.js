export function applyHit(scene, attacker, defender, weapon, power, range, knockback = 260) {
  const dx = defender.x - attacker.x;
  const dist = Math.abs(dx);
  if (dist > range) return false;

  const dmg = Math.round(power * weapon.damage);
  defender.hp = Math.max(0, defender.hp - dmg);
  defender.stun = 260;
  defender.sprite.setVelocityX(Math.sign(dx || attacker.face) * knockback);
  defender.sprite.setTintFill(0xffffff);
  scene.time.delayedCall(70, () => defender.sprite.clearTint());

  scene.flashHit((attacker.x + defender.x) / 2, defender.y - 70, weapon.glow);
  scene.cameras.main.shake(90, 0.006);
  attacker.combo += 1;
  attacker.comboTimer = 1200;
  return true;
}

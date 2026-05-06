3D Tower of Hanoi Learning Game
Web Design Course (HTML + CSS + JS)

1. Game Instruction
- Adjust disk number from 3 to 8.
- Click one peg to select the top disk, then click another peg to place.
- Rule: Larger disk cannot be placed on smaller disk.
- Move all disks to the rightmost peg C to win.
- Support Reset and Auto Solve functions.
- Real-time move counter.

2. Array Methods Used
- push() / pop() : Simulate stack to move disks between pegs
- forEach() : Render disks and loop pegs
- slice() : Copy array for game reset
- length : Check stack height and win condition

3. Technology Stack
Pure HTML + CSS + Vanilla JavaScript
No external libraries, no Canvas / SVG.
CSS 3D transform, perspective, keyframe animations.

4. Visual & Animation
3D perspective layout, gradient background,
disk shadow & rounded edge,
invalid move shake warning, victory glow animation.

5. Known Issues
Auto solve delay is fixed at 600ms.

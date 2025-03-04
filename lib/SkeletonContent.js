"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_linear_gradient_1 = require("expo-linear-gradient");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const v1_1 = require("react-native-redash/lib/module/v1");
const Constants_1 = require("./Constants");
const { useCode, set, cond, eq } = react_native_reanimated_1.default;
const { useState, useCallback } = React;
const styles = react_native_1.StyleSheet.create({
    absoluteGradient: {
        height: '100%',
        position: 'absolute',
        width: '100%'
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    gradientChild: {
        flex: 1
    }
});
const useLayout = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onLayout = useCallback(event => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
    }, []);
    return [size, onLayout];
};
const SkeletonContent = ({ containerStyle = styles.container, easing = Constants_1.DEFAULT_EASING, duration = Constants_1.DEFAULT_DURATION, layout = [], animationType = Constants_1.DEFAULT_ANIMATION_TYPE, animationDirection = Constants_1.DEFAULT_ANIMATION_DIRECTION, isLoading = Constants_1.DEFAULT_LOADING, boneColor = Constants_1.DEFAULT_BONE_COLOR, highlightColor = Constants_1.DEFAULT_HIGHLIGHT_COLOR, children }) => {
    const animationValue = v1_1.useValue(0);
    const loadingValue = v1_1.useValue(isLoading ? 1 : 0);
    const shiverValue = v1_1.useValue(animationType === 'shiver' ? 1 : 0);
    const [componentSize, onLayout] = useLayout();
    useCode(() => cond(eq(loadingValue, 1), [
        cond(eq(shiverValue, 1), [
            set(animationValue, v1_1.loop({
                duration,
                easing
            }))
        ], [
            set(animationValue, v1_1.loop({
                duration: duration / 2,
                easing,
                boomerang: true
            }))
        ])
    ]), [loadingValue, shiverValue, animationValue]);
    const getBoneWidth = (boneLayout) => (typeof boneLayout.width === 'string'
        ? componentSize.width
        : boneLayout.width) || 0;
    const getBoneHeight = (boneLayout) => (typeof boneLayout.height === 'string'
        ? componentSize.height
        : boneLayout.height) || 0;
    const getGradientEndDirection = (boneLayout) => {
        let direction = { x: 0, y: 0 };
        if (animationType === 'shiver') {
            if (animationDirection === 'horizontalLeft' ||
                animationDirection === 'horizontalRight') {
                direction = { x: 1, y: 0 };
            }
            else if (animationDirection === 'verticalTop' ||
                animationDirection === 'verticalDown') {
                direction = { x: 0, y: 1 };
            }
            else if (animationDirection === 'diagonalTopRight' ||
                animationDirection === 'diagonalDownRight' ||
                animationDirection === 'diagonalDownLeft' ||
                animationDirection === 'diagonalTopLeft') {
                const boneWidth = getBoneWidth(boneLayout);
                const boneHeight = getBoneHeight(boneLayout);
                if (boneWidth && boneHeight && boneWidth > boneHeight)
                    return { x: 0, y: 1 };
                return { x: 1, y: 0 };
            }
        }
        return direction;
    };
    const getBoneStyles = (boneLayout) => {
        const { backgroundColor, borderRadius } = boneLayout;
        const boneWidth = getBoneWidth(boneLayout);
        const boneHeight = getBoneHeight(boneLayout);
        const boneStyle = Object.assign({ width: boneWidth, height: boneHeight, borderRadius: borderRadius || Constants_1.DEFAULT_BORDER_RADIUS }, boneLayout);
        if (animationType !== 'pulse') {
            boneStyle.overflow = 'hidden';
            boneStyle.backgroundColor = backgroundColor || boneColor;
        }
        if (animationDirection === 'diagonalDownRight' ||
            animationDirection === 'diagonalDownLeft' ||
            animationDirection === 'diagonalTopRight' ||
            animationDirection === 'diagonalTopLeft') {
            boneStyle.justifyContent = 'center';
            boneStyle.alignItems = 'center';
        }
        return boneStyle;
    };
    const getGradientSize = (boneLayout) => {
        const boneWidth = getBoneWidth(boneLayout);
        const boneHeight = getBoneHeight(boneLayout);
        const gradientStyle = {};
        if (animationDirection === 'diagonalDownRight' ||
            animationDirection === 'diagonalDownLeft' ||
            animationDirection === 'diagonalTopRight' ||
            animationDirection === 'diagonalTopLeft') {
            gradientStyle.width = boneWidth;
            gradientStyle.height = boneHeight;
            if (boneHeight >= boneWidth)
                gradientStyle.height *= 1.5;
            else
                gradientStyle.width *= 1.5;
        }
        return gradientStyle;
    };
    const getStaticBoneStyles = (boneLayout) => {
        const pulseStyles = [
            getBoneStyles(boneLayout),
            {
                backgroundColor: v1_1.interpolateColor(animationValue, {
                    inputRange: [0, 1],
                    outputRange: [boneColor, highlightColor]
                })
            }
        ];
        if (animationType === 'none')
            pulseStyles.pop();
        return pulseStyles;
    };
    const getPositionRange = (boneLayout) => {
        const outputRange = [];
        // use layout dimensions for percentages (string type)
        const boneWidth = getBoneWidth(boneLayout);
        const boneHeight = getBoneHeight(boneLayout);
        if (animationDirection === 'horizontalRight') {
            outputRange.push(-boneWidth, +boneWidth);
        }
        else if (animationDirection === 'horizontalLeft') {
            outputRange.push(+boneWidth, -boneWidth);
        }
        else if (animationDirection === 'verticalDown') {
            outputRange.push(-boneHeight, +boneHeight);
        }
        else if (animationDirection === 'verticalTop') {
            outputRange.push(+boneHeight, -boneHeight);
        }
        return outputRange;
    };
    const getGradientTransform = (boneLayout) => {
        let transform = {};
        const boneWidth = getBoneWidth(boneLayout);
        const boneHeight = getBoneHeight(boneLayout);
        if (animationDirection === 'verticalTop' ||
            animationDirection === 'verticalDown' ||
            animationDirection === 'horizontalLeft' ||
            animationDirection === 'horizontalRight') {
            const interpolatedPosition = react_native_reanimated_1.interpolateNode(animationValue, {
                inputRange: [0, 1],
                outputRange: getPositionRange(boneLayout)
            });
            if (animationDirection === 'verticalTop' ||
                animationDirection === 'verticalDown') {
                transform = { translateY: interpolatedPosition };
            }
            else {
                transform = { translateX: interpolatedPosition };
            }
        }
        else if (animationDirection === 'diagonalDownRight' ||
            animationDirection === 'diagonalTopRight' ||
            animationDirection === 'diagonalDownLeft' ||
            animationDirection === 'diagonalTopLeft') {
            const diagonal = Math.sqrt(boneHeight * boneHeight + boneWidth * boneWidth);
            const mainDimension = Math.max(boneHeight, boneWidth);
            const oppositeDimension = mainDimension === boneWidth ? boneHeight : boneWidth;
            const diagonalAngle = Math.acos(mainDimension / diagonal);
            let rotateAngle = animationDirection === 'diagonalDownRight' ||
                animationDirection === 'diagonalTopLeft'
                ? Math.PI / 2 - diagonalAngle
                : Math.PI / 2 + diagonalAngle;
            const additionalRotate = animationDirection === 'diagonalDownRight' ||
                animationDirection === 'diagonalTopLeft'
                ? 2 * diagonalAngle
                : -2 * diagonalAngle;
            const distanceFactor = (diagonal + oppositeDimension) / 2;
            if (mainDimension === boneWidth && boneWidth !== boneHeight)
                rotateAngle += additionalRotate;
            const sinComponent = Math.sin(diagonalAngle) * distanceFactor;
            const cosComponent = Math.cos(diagonalAngle) * distanceFactor;
            let xOutputRange = [0, 0];
            let yOutputRange = [0, 0];
            if (animationDirection === 'diagonalDownRight' ||
                animationDirection === 'diagonalTopLeft') {
                xOutputRange =
                    animationDirection === 'diagonalDownRight'
                        ? [-sinComponent, sinComponent]
                        : [sinComponent, -sinComponent];
                yOutputRange =
                    animationDirection === 'diagonalDownRight'
                        ? [-cosComponent, cosComponent]
                        : [cosComponent, -cosComponent];
            }
            else {
                xOutputRange =
                    animationDirection === 'diagonalDownLeft'
                        ? [-sinComponent, sinComponent]
                        : [sinComponent, -sinComponent];
                yOutputRange =
                    animationDirection === 'diagonalDownLeft'
                        ? [cosComponent, -cosComponent]
                        : [-cosComponent, cosComponent];
                if (mainDimension === boneHeight && boneWidth !== boneHeight) {
                    xOutputRange.reverse();
                    yOutputRange.reverse();
                }
            }
            let translateX = react_native_reanimated_1.interpolateNode(animationValue, {
                inputRange: [0, 1],
                outputRange: xOutputRange
            });
            let translateY = react_native_reanimated_1.interpolateNode(animationValue, {
                inputRange: [0, 1],
                outputRange: yOutputRange
            });
            // swapping the translates if width is the main dim
            if (mainDimension === boneWidth)
                [translateX, translateY] = [translateY, translateX];
            const rotate = `${rotateAngle}rad`;
            transform = { translateX, translateY, rotate };
        }
        return transform;
    };
    const getBoneContainer = (layoutStyle, childrenBones, key) => (<react_native_1.View key={layoutStyle.key || key} style={layoutStyle}>
      {childrenBones}
    </react_native_1.View>);
    const getStaticBone = (layoutStyle, key) => (<react_native_reanimated_1.default.View key={layoutStyle.key || key} style={getStaticBoneStyles(layoutStyle)}/>);
    const getShiverBone = (layoutStyle, key) => {
        const animatedStyle = Object.assign({ transform: [getGradientTransform(layoutStyle)] }, getGradientSize(layoutStyle));
        return (<react_native_1.View key={layoutStyle.key || key} style={getBoneStyles(layoutStyle)}>
        <react_native_reanimated_1.default.View style={[styles.absoluteGradient, animatedStyle]}>
          <expo_linear_gradient_1.LinearGradient colors={[boneColor, highlightColor, boneColor]} start={{ x: 0, y: 0 }} end={getGradientEndDirection(layoutStyle)} style={styles.gradientChild}/>
        </react_native_reanimated_1.default.View>
      </react_native_1.View>);
    };
    const getBones = (bonesLayout, childrenItems, prefix = '') => {
        if (bonesLayout && bonesLayout.length > 0) {
            const iterator = new Array(bonesLayout.length).fill(0);
            return iterator.map((_, i) => {
                // has a nested layout
                if (bonesLayout[i].children && bonesLayout[i].children.length > 0) {
                    const containerPrefix = bonesLayout[i].key || `bone_container_${i}`;
                    const _a = bonesLayout[i], { children: childBones } = _a, layoutStyle = __rest(_a, ["children"]);
                    return getBoneContainer(layoutStyle, getBones(childBones, [], containerPrefix), containerPrefix);
                }
                if (animationType === 'pulse' || animationType === 'none') {
                    return getStaticBone(bonesLayout[i], prefix ? `${prefix}_${i}` : i);
                }
                return getShiverBone(bonesLayout[i], prefix ? `${prefix}_${i}` : i);
            });
            // no layout, matching children's layout
        }
        return React.Children.map(childrenItems, (child, i) => {
            const styling = child.props.style || {};
            if (animationType === 'pulse' || animationType === 'none') {
                return getStaticBone(styling, i);
            }
            return getShiverBone(styling, i);
        });
    };
    return (<react_native_1.View style={containerStyle} onLayout={onLayout}>
      {isLoading ? getBones(layout, children) : children}
    </react_native_1.View>);
};
exports.default = React.memo(SkeletonContent);

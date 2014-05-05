exports.initialize = function (amazonSdk, facebookSdk) {
    var groupLikes = function (likes) {
        var grouped = {
            categories: [],
            maxCount: 0
        };

        for (var i = 0; i < likes.length; i++) {
            var like = likes[i];

            if (!grouped.categories[like.category]) {
                grouped.categories[like.category] = [];
            }

            var group = grouped.categories[like.category];
            group.push(like);

            if (group.length > grouped.maxCount) {
                grouped.mostLiked = like.category;
                grouped.maxCount = group.length;
            }
        }

        return grouped;
    };

    var mostRecentAndLiked = function (groupedLikes) {
        var mostLikedCategory = groupedLikes.categories[groupedLikes.mostLiked];
        var recent = mostLikedCategory[0];

        for (var i = 1; i < mostLikedCategory.length; i++) {
            var current = mostLikedCategory[i];
            if (new Date(current.created_time) > new Date(recent.created_time)) {
                recent = current;
            }
        }

        return recent;
    }

    return {
        groupLikesByCategory: groupLikes,
        recentFromMostLikedCategory: mostRecentAndLiked
    }
}
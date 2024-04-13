import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";

const PostCard = ({ post }: { post: any }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={post.img}
        alt="Post image"
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {post.title}
        </Typography>
        {/* ここに他の投稿情報を表示するコードを追加 */}
      </CardContent>
    </Card>
  );
};

export default PostCard;
